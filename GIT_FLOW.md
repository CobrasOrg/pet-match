# 🐾 Pet Match – GitFlow Branching Guide

Este proyecto sigue el modelo de ramas **GitFlow** para mantener un desarrollo ordenado y profesional. Este documento explica cómo trabajar con Git en este repositorio y cuáles son las reglas que todos deben seguir.

---

## 📌 ¿Qué es GitFlow?

**GitFlow** es una estrategia de branching que separa el desarrollo en diferentes ramas con propósitos claros:

- **main**: contiene el código estable en producción (solo releases y hotfixes)
- **develop**: contiene el código en desarrollo (base para nuevas features)
- **feature/***: nuevas funcionalidades (se crean desde develop)
- **release/***: preparación para una nueva versión (desde develop hacia main)
- **hotfix/***: correcciones urgentes en producción (desde main hacia main y develop)

---

## ⚙️ Configuración inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/CobrasOrg/pet-match.git
cd pet-match
```

### 2. Instalar Git Flow (si no lo tienes)

**macOS:**
```bash
brew install git-flow
```

**Ubuntu/Debian:**
```bash
sudo apt-get install git-flow
```

**Windows:**
Git Flow viene incluido con Git for Windows.

### 3. Inicializar GitFlow

```bash
git flow init
```

Responde a las preguntas así:

```text
Branch name for production releases: main
Branch name for "next release" development: develop
Feature branches? [feature/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []
```

---

## 🚀 Flujo de trabajo detallado

### 🔧 Trabajar con Features (Nuevas funcionalidades)

Las features se usan para desarrollar nuevas funcionalidades que se integrarán en la próxima release.

#### Ejemplo: Crear sistema de autenticación

```bash
# 1. Asegúrate de estar en develop actualizado
git checkout develop
git pull origin develop

# 2. Crear nueva feature
git flow feature start sistema-autenticacion

# Esto crea y te cambia a: feature/sistema-autenticacion
```

#### Trabajar en la feature

```bash
# 3. Desarrollar la funcionalidad
touch src/auth/login.js
touch src/auth/register.js
touch src/components/LoginForm.jsx

# 4. Hacer commits regulares
git add src/auth/login.js
git commit -m "feat: añade lógica de login básica"

git add src/auth/register.js  
git commit -m "feat: implementa registro de usuarios"

git add src/components/LoginForm.jsx
git commit -m "feat: crea componente de formulario de login"

# 5. Subir cambios regularmente (opcional pero recomendado)
git push origin feature/sistema-autenticacion
```

#### Finalizar la feature

```bash
# 6. Finalizar feature (mergea a develop y elimina la rama)
git flow feature finish sistema-autenticacion

# 7. Subir develop actualizado
git push origin develop

# 8. Eliminar rama remota (si la creaste)
git push origin --delete feature/sistema-autenticacion
```

#### Ejemplo alternativo: Feature con Pull Request

```bash
# Si tu equipo usa Pull Requests, NO uses finish
git flow feature start mejora-ui-perfil

# ... desarrollo y commits ...

# Subir para crear PR
git push origin feature/mejora-ui-perfil

# Crear PR en GitHub: feature/mejora-ui-perfil → develop
# Después del merge, eliminar rama local
git checkout develop
git pull origin develop
git branch -d feature/mejora-ui-perfil
```

---

### 📦 Trabajar con Releases (Preparación de versiones)

Las releases se usan para preparar una nueva versión estable antes de producción.

#### Ejemplo: Preparar versión 1.2.0

```bash
# 1. Asegúrate de que develop esté actualizado
git checkout develop
git pull origin develop

# 2. Crear release
git flow release start 1.2.0

# Esto crea y te cambia a: release/1.2.0
```

#### Preparar la release

```bash
# 3. Actualizar versión en package.json
sed -i 's/"version": "1.1.0"/"version": "1.2.0"/' package.json

# 4. Actualizar CHANGELOG.md
echo "## [1.2.0] - $(date +%Y-%m-%d)" >> CHANGELOG.md
echo "### Added" >> CHANGELOG.md
echo "- Sistema de autenticación completo" >> CHANGELOG.md
echo "- Mejoras en UI del perfil" >> CHANGELOG.md

# 5. Commit de preparación
git add package.json CHANGELOG.md
git commit -m "release: prepara versión 1.2.0"

# 6. Ejecutar pruebas finales
npm test
npm run build

# 7. Corregir bugs menores si es necesario
git add .
git commit -m "fix: corrige validación en formulario de registro"
```

#### Finalizar la release

```bash
# 8. Finalizar release (mergea a main y develop, crea tag)
git flow release finish 1.2.0

# Se abrirá un editor para el mensaje del tag, ejemplo:
# "Release v1.2.0 - Añade sistema de autenticación"

# 9. Subir todos los cambios
git push origin main
git push origin develop
git push --tags
```

---

### 🔥 Trabajar con Hotfixes (Correcciones urgentes)

Los hotfixes se usan para corregir bugs críticos en producción.

#### Ejemplo: Corregir error crítico en login

```bash
# 1. Asegúrate de que main esté actualizado
git checkout main
git pull origin main

# 2. Crear hotfix
git flow hotfix start 1.2.1

# Esto crea y te cambia a: hotfix/1.2.1
```

#### Aplicar la corrección

```bash
# 3. Identificar y corregir el bug
# Ejemplo: corregir validación de email en login.js
vim src/auth/login.js

# 4. Actualizar versión
sed -i 's/"version": "1.2.0"/"version": "1.2.1"/' package.json

# 5. Actualizar CHANGELOG.md
echo "## [1.2.1] - $(date +%Y-%m-%d)" >> CHANGELOG.md
echo "### Fixed" >> CHANGELOG.md
echo "- Corrige validación de email en login que impedía el acceso" >> CHANGELOG.md

# 6. Commit de la corrección
git add .
git commit -m "hotfix: corrige validación de email en login"

# 7. Probar la corrección
npm test
```

#### Finalizar el hotfix

```bash
# 8. Finalizar hotfix (mergea a main y develop, crea tag)
git flow hotfix finish 1.2.1

# 9. Subir todos los cambios
git push origin main
git push origin develop
git push --tags
```

---

## 🔐 Reglas del repositorio (GitHub Rulesets)

### Branch Protection Rules configuradas:

- **main**: 
  - No push directo
  - Requiere PR con revisión
  - Requiere status checks
  - No permite force push

- **develop**:
  - No push directo
  - Requiere PR con revisión
  - Permite merge de features via PR

### Flujo recomendado con Pull Requests:

```bash
# Para features grandes o trabajo en equipo
git flow feature start nueva-funcionalidad

# ... desarrollo ...

git push origin feature/nueva-funcionalidad
# Crear PR en GitHub: feature/nueva-funcionalidad → develop
# Después del merge y aprobación:
git checkout develop
git pull origin develop
git branch -d feature/nueva-funcionalidad
```

---

## 💡 Convenciones y buenas prácticas

### Nomenclatura de ramas:

```bash
# Features
feature/sistema-autenticacion
feature/dashboard-admin
feature/notificaciones-email

# Releases
release/1.0.0
release/2.1.0

# Hotfixes
hotfix/1.0.1
hotfix/2.1.1
```

### Mensajes de commit:

```bash
# Usar conventional commits
git commit -m "feat: añade sistema de autenticación"
git commit -m "fix: corrige validación en formulario"
git commit -m "docs: actualiza README con ejemplos"
git commit -m "style: mejora estilos del header"
git commit -m "refactor: optimiza consultas de base de datos"
```

### Antes de empezar cualquier trabajo:

```bash
# Siempre actualizar antes de crear ramas
git checkout develop
git pull origin develop

# Verificar estado
git status
git log --oneline -5
```

---

## 🛠️ Comandos útiles para el día a día

### Ver todas las ramas:
```bash
git branch -a
```

### Ver features activas:
```bash
git flow feature list
```

### Cambiar entre ramas:
```bash
git checkout develop
git checkout feature/mi-feature
git checkout main
```

### Sincronizar con remoto:
```bash
git fetch origin
git pull origin develop
```

### Limpiar ramas locales eliminadas:
```bash
git remote prune origin
git branch -d nombre-rama-local
```

---

## 🚨 Casos de emergencia

### Si te equivocaste de rama:
```bash
# Mover commits a la rama correcta
git log --oneline -3  # ver últimos commits
git reset --hard HEAD~2  # volver 2 commits atrás
git checkout rama-correcta
git cherry-pick <commit-hash>
```

### Si necesitas deshacer un release:
```bash
# Solo antes de hacer push
git flow release finish 1.0.0
git reset --hard HEAD~1
git tag -d 1.0.0
```

### Si hay conflictos en merge:
```bash
git status  # ver archivos en conflicto
# Resolver conflictos manualmente
git add .
git commit -m "resolve: conflictos en merge"
```

---

## ✅ Recursos útiles

* [Guía visual de GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)
* [Documentación oficial de GitFlow CLI](https://github.com/nvie/gitflow/wiki)
* [Conventional Commits](https://www.conventionalcommits.org/)
* [GitHub Flow vs GitFlow](https://lucamezzalira.com/2014/03/10/git-flow-vs-github-flow/)

---

## 🎯 Checklist para el equipo

### Antes de empezar a trabajar:
- [ ] Clonar repo y ejecutar `git flow init`
- [ ] Verificar que estás en la rama correcta
- [ ] Actualizar con `git pull origin develop`

### Para cada feature:
- [ ] Crear feature desde develop actualizado
- [ ] Usar commits descriptivos y regulares
- [ ] Probar funcionalidad antes de finalizar
- [ ] Crear PR si es requerido por el equipo

### Para releases:
- [ ] Actualizar versión en package.json
- [ ] Actualizar CHANGELOG.md
- [ ] Ejecutar pruebas completas
- [ ] Crear tag con descripción clara

Con esta guía, esperamos mantener un flujo de trabajo limpio, organizado y colaborativo. ¡Gracias por seguir estas buenas prácticas!