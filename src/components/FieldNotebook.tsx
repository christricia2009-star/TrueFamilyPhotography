import { useState } from "react";
import { fieldNoteItems } from "../data/studio";
import { listCheckedNotes, toggleNote } from "../lib/storage";

export function FieldNotebook() {
  const [checked, setChecked] = useState(listCheckedNotes);

  function onToggle(id: string) {
    toggleNote(id);
    setChecked(listCheckedNotes());
  }

  return (
    <section className="section tight">
      <div className="wrap">
        <p className="kicker">Field notebook</p>
        <h2>Things to notice</h2>
        <p className="coloring-lead">Take this to the park. Tick them when you find them. Grown-ups may help. They usually miss the bug.</p>
        <ul className="notebook">
          {fieldNoteItems.map((item) => (
            <li key={item.id}>
              <label>
                <input type="checkbox" checked={checked.includes(item.id)} onChange={() => onToggle(item.id)} />
                <span>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
