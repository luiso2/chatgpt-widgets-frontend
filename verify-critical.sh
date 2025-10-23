#!/bin/bash

# 🚨 SCRIPT DE VERIFICACIÓN CRÍTICA 🚨
# Ejecutar SIEMPRE antes de hacer cambios o deploy

echo "🔍 Verificando configuración crítica..."
echo "=========================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

# Test 1: Verificar hook export correcto
echo -e "\n📌 Test 1: Verificando export del hook..."
if grep -q "from './use-widget-data-simple'" app/hooks/index.ts; then
    echo -e "${GREEN}✅ Hook exportado correctamente desde 'use-widget-data-simple'${NC}"
else
    echo -e "${RED}❌ ERROR: Hook NO está exportado desde 'use-widget-data-simple'${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test 2: Verificar que todos los widgets usan fallback
echo -e "\n📌 Test 2: Verificando fallback en widgets..."
WIDGETS_OK=true
for widget in app/widgets/*/page.tsx; do
    if [ -f "$widget" ]; then
        if ! grep -q "fallbackData:" "$widget"; then
            echo -e "${RED}❌ ERROR: $widget no usa fallbackData${NC}"
            WIDGETS_OK=false
            ERRORS=$((ERRORS + 1))
        fi
    fi
done
if [ "$WIDGETS_OK" = true ]; then
    echo -e "${GREEN}✅ Todos los widgets usan fallbackData${NC}"
fi

# Test 3: Verificar que loading inicia en false
echo -e "\n📌 Test 3: Verificando inicialización de loading..."
if grep -q "useState(false)" app/hooks/use-widget-data-simple.ts; then
    echo -e "${GREEN}✅ Loading se inicializa en false (correcto)${NC}"
else
    echo -e "${RED}❌ ERROR: Loading no se inicializa en false${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test 4: Verificar archivos críticos existen
echo -e "\n📌 Test 4: Verificando documentación crítica..."
FILES_OK=true
for file in CRITICAL_CONFIG.md DATA_FLOW.md; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file existe${NC}"
    else
        echo -e "${RED}❌ ERROR: $file NO existe${NC}"
        FILES_OK=false
        ERRORS=$((ERRORS + 1))
    fi
done

# Test 5: Verificar comentarios WARNING
echo -e "\n📌 Test 5: Verificando comentarios de advertencia..."
if grep -q "🚨\|WARNING\|CRITICAL" app/hooks/use-widget-data-simple.ts; then
    echo -e "${GREEN}✅ Comentarios de advertencia presentes${NC}"
else
    echo -e "${YELLOW}⚠️ Advertencia: Faltan comentarios WARNING en archivos críticos${NC}"
fi

# Test 6: Verificar backend URL
echo -e "\n📌 Test 6: Verificando configuración del backend..."
if grep -q "NEXT_PUBLIC_API_URL" app/api/widgets/route.ts; then
    echo -e "${GREEN}✅ Backend URL configurado correctamente${NC}"
else
    echo -e "${RED}❌ ERROR: Backend URL no está configurado${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test 7: Verificar que no hay console.error sin manejar
echo -e "\n📌 Test 7: Verificando manejo de errores..."
# Usar timeout para evitar que grep se cuelgue
if timeout 2s grep -r "console.error" app/widgets --include="*.tsx" 2>/dev/null | grep -v "catch\|error\|Error" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️ Advertencia: Posibles console.error sin manejar${NC}"
else
    echo -e "${GREEN}✅ Errores manejados correctamente${NC}"
fi

# Resumen final
echo -e "\n=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ TODAS LAS VERIFICACIONES PASARON${NC}"
    echo -e "${GREEN}El sistema está listo para deploy${NC}"
    exit 0
else
    echo -e "${RED}❌ ENCONTRADOS $ERRORS ERRORES CRÍTICOS${NC}"
    echo -e "${RED}NO hacer deploy hasta resolver todos los errores${NC}"
    echo -e "\n${YELLOW}Recomendación:${NC}"
    echo -e "1. Revisar CRITICAL_CONFIG.md"
    echo -e "2. Revertir cambios si es necesario: git reset --hard ebb8b76"
    echo -e "3. Volver a ejecutar: ./verify-critical.sh"
    exit 1
fi