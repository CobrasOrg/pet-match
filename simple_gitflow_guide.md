# Guía Simple de GitFlow

## 🚀 Reglas básicas

1. **NUNCA** hacer push directo a `main` o `develop`
2. **SIEMPRE** usar Pull Requests
3. **USAR** nombres de rama correctos

## 📋 Nombres de rama permitidos

```
feature/nombre-descriptivo    # Para nuevas funcionalidades
hotfix/nombre-del-error      # Para correcciones urgentes
release/numero-version       # Para preparar releases
```

## 🔄 Flujo de trabajo

### 1. Nueva funcionalidad (Feature)

```bash
# Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/mi-nueva-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "Agregar nueva funcionalidad"

# Subir rama
git push -u origin feature/mi-nueva-funcionalidad

# Crear PR hacia develop en GitHub
```

### 2. Corrección urgente (Hotfix)

```bash
# Crear rama desde main
git checkout main
git pull origin main
git checkout -b hotfix/corregir-error-critico

# Hacer cambios y commits
git add .
git commit -m "Corregir error crítico"

# Subir rama
git push -u origin hotfix/corregir-error-critico

# Crear PR hacia main en GitHub
```

### 3. Nueva versión (Release)

```bash
# Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Hacer ajustes finales
git add .
git commit -m "Preparar release v1.2.0"

# Subir rama
git push -u origin release/v1.2.0

# Crear PR hacia main en GitHub
```

## ⚙️ Configuración en GitHub

1. Ve a **Settings** → **Branches**
2. Agrega regla para `main`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
3. Agrega regla para `develop`:
   - ✅ Require pull request reviews before merging

## 🚨 Qué pasa si...

### "Intento hacer push directo a main/develop"

- ❌ GitHub Actions lo bloquea
- 💡 Solución: Crear una rama y hacer PR

### "Mi rama tiene nombre incorrecto"

- ❌ El PR no se puede hacer merge
- 💡 Solución: Cambiar nombre de rama o crear nueva

### "Apunto mi PR a la rama incorrecta"

- ❌ La validación falla
- 💡 Solución: Cambiar el target del PR

## 📞 ¿Necesitas ayuda?

Si tienes dudas sobre el flujo, pregunta al equipo antes de hacer cambios.

---

**Recuerda:** La idea es mantener `main` estable y `develop` como punto de integración. ¡Simple y efectivo! 🎯
