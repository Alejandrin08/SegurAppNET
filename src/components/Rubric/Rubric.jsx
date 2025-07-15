import "./Rubric.css";
import { useEffect, useRef } from "react";

const Rubric = () => {
  const dynamicCells = [
    'Se utiliza el atributo [Authorize(Roles = "...")] en todas las acciones/controladores que requieren control de acceso.',
    "Solo algunas acciones/controladores clave usan el atributo de roles.",
    "No se usa el atributo de roles en ningún controlador o acción.",
    "Los roles son diferenciados y coinciden con funciones específicas del sistema (ej. Admin, Usuario).",
    "Se aplican roles, pero en casos donde no son necesarios o de forma redundante.",
    "Los roles se aplican de forma arbitraria o irrelevante.",
    "Impide el acceso no autorizado a funciones críticas o que no corresponden al rol asignado.",
    "Algunas acciones están protegidas, pero otras sensibles pueden accederse sin rol.",
    "Todas las acciones están accesibles independientemente del rol asignado.",
  ];

  const rowRefs = useRef([]);
  const stripeRefs = useRef([]);
  const gridRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const updateStripes = () => {
      if (!gridRef.current || !wrapperRef.current) return;

      const rows = Array.from(gridRef.current.children).slice(4);
      const rowGroups = [];

      for (let i = 0; i < rows.length; i += 4) {
        rowGroups.push(rows.slice(i, i + 4));
      }

      rowGroups.forEach((rowCells, rowIndex) => {
        if (!stripeRefs.current[rowIndex]) return;

        let maxHeight = 0;
        rowCells.forEach((cell) => {
          const cellHeight = cell.offsetHeight;
          if (cellHeight > maxHeight) maxHeight = cellHeight;
        });

        const rowTop = rowCells[0].offsetTop;
        const wrapperTop = wrapperRef.current.offsetTop;

        const stripe = stripeRefs.current[rowIndex];
        stripe.style.height = `${maxHeight}px`;
        stripe.style.top = `${rowTop}px`;
        stripe.style.width = "100%";
      });
    };

    const observer = new MutationObserver(updateStripes);
    if (gridRef.current) {
      observer.observe(gridRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    updateStripes();
    window.addEventListener("resize", updateStripes);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateStripes);
    };
  }, []);

  return (
    <div className="rubric-container">
      <div className="rubric-wrapper" ref={wrapperRef}>
        <div className="horizontal-stripes">
          {[...Array(3)].map((_, i) => (
            <div
              key={`h-${i}`}
              ref={(el) => (stripeRefs.current[i] = el)}
              className="horizontal-stripe"
            />
          ))}
        </div>

        <div className="vertical-stripes">
          {[...Array(4)].map((_, i) => (
            <div key={`v-${i}`} className="vertical-stripe" />
          ))}
        </div>

        <div className="rubric-grid" ref={gridRef}>
          <div className="rubric-cell header first-col row-0">
            <h3 className="cell-content">Criterio</h3>
          </div>
          <div className="rubric-cell header row-0">
            <h3 className="cell-content">Logrado (2 puntos)</h3>
          </div>
          <div className="rubric-cell header row-0">
            <h3 className="cell-content">Parcialmente (1 punto)</h3>
          </div>
          <div className="rubric-cell header last-col row-0">
            <h3 className="cell-content">No logrado (0 puntos)</h3>
          </div>

          <div
            ref={(el) => (rowRefs.current[1] = el)}
            className="rubric-cell row-header first-col row-1"
          >
            <h3 className="cell-content">Implementación correcta</h3>
          </div>
          {dynamicCells.slice(0, 3).map((text, index) => (
            <div key={`dyn-1-${index}`} className="rubric-cell row-1">
              <p className="cell-content">{text}</p>
            </div>
          ))}

          <div
            ref={(el) => (rowRefs.current[2] = el)}
            className="rubric-cell row-header first-col row-2"
          >
            <h3 className="cell-content">Precondición de aplicación</h3>
          </div>
          {dynamicCells.slice(3, 6).map((text, index) => (
            <div key={`dyn-2-${index}`} className="rubric-cell row-2">
              <p className="cell-content">{text}</p>
            </div>
          ))}

          <div
            ref={(el) => (rowRefs.current[3] = el)}
            className="rubric-cell row-header first-col row-3"
          >
            <h3 className="cell-content">Prevención de vulnerabilidades</h3>
          </div>
          {dynamicCells.slice(6, 9).map((text, index) => (
            <div key={`dyn-3-${index}`} className="rubric-cell row-3">
              <p className="cell-content">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rubric;
