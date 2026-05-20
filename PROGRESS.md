# PROGRESS — rodai-www (www.rodai.io)

## Sesión: 2026-05-20

### ¿Qué se hizo?

#### 1. Identificación del repositorio correcto
- El proyecto de `www.rodai.io` está en **`github.com/erick8026/Rodai`**
- Vinculado al proyecto Vercel: `https://vercel.com/erick-marins-projects/rodai`
- Es un sitio **HTML estático** (no Next.js), con `index.html`, `styles.css`, `script.js`
- Deploy automático: cada push a `main` → Vercel despliega en `www.rodai.io`

#### 2. Sección de video Vimeo agregada (`index.html`)
- **Video ID:** `1194076479`
- **Título:** "RODAI: Automatización Inmobiliaria con LIA"
- **Ubicación en la página:** entre la sección `#como-funciona` y el CTA final
- **ID de anclaje:** `#demo`
- Estilo dark-theme coherente con el diseño existente:
  - Glass card con gradiente oscuro
  - Borde azul brillante (`rgba(51,182,255,0.28)`)
  - Glow sutil purple/azul en el box-shadow
  - Border-radius 28px / video interior 22px
- Script de Vimeo Player API cargado con `defer` antes del chatbot widget
- Link **"Ver demo"** agregado al navbar de navegación

#### 3. Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `index.html` | +56 líneas: CSS `.video-shell`, `.video-ratio`, HTML sección `#demo`, script Vimeo, link navbar |

#### 4. Commit & Deploy
```
commit 98c4813
feat: agrega sección de video explainer Vimeo en página principal
→ pushed to origin/main → Vercel auto-deploy a www.rodai.io
```

---

## Notas importantes para próximas sesiones

- **NO confundir** este repo (`erick8026/Rodai`) con `rodai-master-crm` (que es el CRM en `app.rodai.io`)
- Repo CRM: `/Users/erickmr/Documents/RODAI-CRM/rodai-master-crm` → `app.rodai.io`
- Repo sitio público: `/Users/erickmr/Documents/rodai-www` → `www.rodai.io`
- El sitio público es HTML puro. No uses comandos Next.js aquí.
- Para ver cambios en local: abrir `index.html` directamente en el navegador (no requiere servidor)
