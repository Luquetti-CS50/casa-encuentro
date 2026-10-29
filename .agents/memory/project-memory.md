# Palacio Mental: Memoria de Proyecto Casa Encuentro

## Identidad y Propósito
- **Establecimiento:** Casa Encuentro (General Las Heras - Provincia de Buenos Aires, Argentina).
- **Eslogan / Manifiesto:** "En calma se ven los colores con mayor intensidad", "Un espacio para sanar, soltar y volver a tu centro".
- **Coordinadora:** Felicia Torres (Feli).
- **Profesionales Registrados en el Espacio:**
  - **Mariano:** Medicina China Tradicional, Acupuntura, Quiropraxia, Ventoterapia, Moxibustión, Masajes Terapéuticos (>16 años de experiencia).
  - **Silvana Camiño:** Masajista terapéutica (relajante, descontracturante, cérvico-cráneo-facial, bruxismo, drenaje linfático Vodder, lumbosacros).
  - **Nathalia:** Instructora de Yoga al aire libre y conexión corporal.
  - **Encuentros Especiales:** Jornadas de Bienestar, Cuencos sonoros / Biosónica y Samafones ("Pausa").

## Directivas Arquitectónicas
1. **Aislamiento Absoluto:** No tocar directorios fuera del repositorio.
2. **Cero Hardcoding:** Teléfonos, tarifas, alias y textos de WhatsApp provienen de `SiteSettings` reactivo.
3. **Máquina de Estados de Turnos:** `AVAILABLE` $\rightarrow$ `PENDING_DEPOSIT` (con bloqueo temporal) $\rightarrow$ `CONFIRMED` / `BLOCKED`.
4. **Ergonomía UI:** Botones con zona táctil mínima de 48px $\times$ 48px, alto contraste (WCAG AA/AAA).
5. **Cero Spinners para Contenido:** Uso estricto de skeletons con geometría idéntica al contenido para evitar layout shift (CLS). Spinners reservados únicamente a micro-acciones en botones.
