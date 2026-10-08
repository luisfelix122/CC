import { useState } from 'react';
import { addFood } from '../lib/api';
import {
  analyzeLabel,
  analyzePlate,
  fileToImage,
  type ImageData,
  type LabelEstimate,
} from '../lib/gemini';
import { scaleItem, scaleLabel, sumItems } from '../lib/nutrition';
import type { FoodItem, FoodKind } from '../lib/types';

interface Props {
  onSaved: () => void;
  onError: (m: string) => void;
  hasKey: boolean;
}

interface Photo extends ImageData {
  preview: string;
}

/** CU-01 (producto por etiqueta), CU-02 (plato por foto) y CU-03 (ajuste antes de guardar). */
export function AddFood({ onSaved, onError, hasKey }: Props) {
  const [kind, setKind] = useState<FoodKind>('plate');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState<LabelEstimate | null>(null);
  const [grams, setGrams] = useState(100);
  const [plateName, setPlateName] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FoodItem[] | null>(null);
  const [newIngredient, setNewIngredient] = useState('');

  const reset = () => {
    setPhotos([]);
    setDescription('');
    setLabel(null);
    setItems(null);
    setNotes('');
    setNewIngredient('');
  };

  const switchKind = (k: FoodKind) => {
    setKind(k);
    reset();
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const added = await Promise.all(
        Array.from(files).map(async (f) => {
          const img = await fileToImage(f);
          return { ...img, preview: `data:${img.mime};base64,${img.base64}` };
        }),
      );
      setPhotos((p) => [...p, ...added]);
    } catch (e) {
      onError((e as Error).message);
    }
  };

  const withBusy = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const analyze = (extra = '') =>
    withBusy(async () => {
      if (kind === 'label') {
        const r = await analyzeLabel(photos);
        setLabel(r);
        setGrams(Math.round(r.suggested_grams) || 100);
      } else {
        const r = await analyzePlate(photos, `${description}${extra}`);
        setPlateName(r.name);
        setNotes(r.notes);
        setItems(r.items);
      }
    });

  const reanalyzeWithCorrections = () => {
    const list = (items ?? []).map((i) => `${i.name} ${i.grams} g`).join(', ');
    const added = newIngredient.trim() ? `, ${newIngredient.trim()}` : '';
    setNewIngredient('');
    return analyze(
      `. Corrección del usuario: los ingredientes reales son: ${list}${added}. Usa exactamente esos ingredientes y gramos.`,
    );
  };

  const save = () =>
    withBusy(async () => {
      if (kind === 'label' && label) {
        await addFood({
          kind,
          name: label.name,
          description: null,
          items: [],
          quantity_g: grams,
          ...scaleLabel(label.per100g, grams),
        });
      } else if (items) {
        await addFood({
          kind,
          name: plateName || 'Plato',
          description: description || null,
          items,
          quantity_g: items.reduce((a, i) => a + i.grams, 0),
          ...sumItems(items),
        });
      }
      reset();
      onSaved();
    });

  if (!hasKey) {
    return (
      <div className="panel paper">
        <h2>Falta configurar la IA</h2>
        <p className="muted">Falta la variable de entorno VITE_GEMINI_API_KEY en el despliegue.</p>
      </div>
    );
  }

  const labelTotals = label ? scaleLabel(label.per100g, grams) : null;
  const plateTotals = items ? sumItems(items) : null;
  const hasResult = kind === 'label' ? !!label : !!items;

  return (
    <section className="stack">
      <div className="segmented" role="tablist">
        <button className={kind === 'plate' ? 'on' : ''} onClick={() => switchKind('plate')}>
          🍽️ Plato
        </button>
        <button className={kind === 'label' ? 'on' : ''} onClick={() => switchKind('label')}>
          📦 Producto
        </button>
      </div>

      <div className="panel paper">
        <p className="muted">
          {kind === 'plate'
            ? 'Toma o sube una foto de tu plato y descríbelo brevemente.'
            : 'Toma una foto del producto. Si la IA lo necesita, te pedirá la tabla nutricional.'}
        </p>
        <div className="photos">
          {photos.map((p, i) => (
            <img key={i} src={p.preview} alt={`Foto ${i + 1}`} />
          ))}
          <label className="photo-add tactile">
            📷 {photos.length ? 'Otra foto' : 'Foto'}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              hidden
              onChange={(e) => {
                void onFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
        </div>
        {kind === 'plate' && (
          <textarea
            placeholder="Ej.: arroz con pollo y ensalada, porción mediana"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        )}
        <button
          className="tactile primary"
          disabled={busy || photos.length === 0}
          onClick={() => analyze()}
        >
          {busy ? 'Analizando…' : hasResult ? '↻ Analizar de nuevo' : '✨ Analizar con IA'}
        </button>
      </div>

      {kind === 'label' && label && labelTotals && (
        <div className="panel paper">
          {!label.enough ? (
            <div className="notice">
              <strong>Necesito más información</strong>
              <p>{label.missing}</p>
              <p className="muted">Añade la foto con “Otra foto” y vuelve a analizar.</p>
            </div>
          ) : (
            <>
              <h2>{label.name}</h2>
              <p className="muted">
                Por 100 g: {label.per100g.kcal} kcal · P {label.per100g.protein_g} g · C{' '}
                {label.per100g.carbs_g} g · G {label.per100g.fat_g} g
              </p>
              <label className="qty">
                Cantidad consumida (g o ml)
                <input
                  type="number"
                  min={1}
                  value={grams}
                  onChange={(e) => setGrams(Number(e.target.value))}
                />
              </label>
              <Totals {...labelTotals} />
              <button className="tactile primary" disabled={busy || grams <= 0} onClick={save}>
                ✓ Confirmar y guardar
              </button>
            </>
          )}
        </div>
      )}

      {kind === 'plate' && items && plateTotals && (
        <div className="panel paper">
          <h2>{plateName}</h2>
          {notes && <p className="muted">{notes}</p>}
          <p className="muted">Ajusta las porciones antes de guardar:</p>
          <ul className="items">
            {items.map((it, i) => (
              <li key={i}>
                <input
                  className="item-name"
                  value={it.name}
                  onChange={(e) =>
                    setItems(items.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                  }
                  aria-label="Ingrediente"
                />
                <input
                  type="number"
                  min={0}
                  value={it.grams}
                  onChange={(e) =>
                    setItems(
                      items.map((x, j) => (j === i ? scaleItem(x, Number(e.target.value)) : x)),
                    )
                  }
                  aria-label={`Gramos de ${it.name}`}
                />
                <span>g</span>
                <strong>{it.kcal} kcal</strong>
                <button
                  className="icon-btn"
                  onClick={() => setItems(items.filter((_, j) => j !== i))}
                  aria-label={`Quitar ${it.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="row">
            <input
              placeholder="Agregar ingrediente (ej.: aguacate 50 g)"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
            />
            <button className="tactile" disabled={busy} onClick={reanalyzeWithCorrections}>
              ↻ Recalcular con IA
            </button>
          </div>
          <Totals {...plateTotals} />
          <button className="tactile primary" disabled={busy || items.length === 0} onClick={save}>
            ✓ Confirmar y guardar
          </button>
        </div>
      )}
    </section>
  );
}

function Totals(t: { kcal: number; protein_g: number; carbs_g: number; fat_g: number }) {
  return (
    <div className="totals plate">
      <strong>{t.kcal} kcal</strong>
      <span>
        P {t.protein_g} g · C {t.carbs_g} g · G {t.fat_g} g
      </span>
    </div>
  );
}
