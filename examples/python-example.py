#!/usr/bin/env python3
"""
============================================
Python Example - Create Widget API Call
============================================
"""

import requests
import json

# URL de la API
API_URL = "https://frontend-production-d329.up.railway.app/api/widgets"

# Datos del widget
widget_data = {
    "type": "chart",
    "title": "Ventas Mensuales 2025",
    "chartType": "bar",
    "labels": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    "data": [12000, 15000, 18000, 22000, 25000, 27000]
}


def create_widget(data):
    """
    Crea un widget llamando a la API.

    Args:
        data (dict): Datos del widget

    Returns:
        dict: Respuesta de la API
    """
    try:
        response = requests.post(
            API_URL,
            headers={"Content-Type": "application/json"},
            json=data,
            timeout=30
        )

        response.raise_for_status()  # Lanza excepción si hay error HTTP
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"❌ Error al crear widget: {e}")
        raise


def main():
    """Función principal"""
    print("📊 Creando widget...\n")
    print("Datos enviados:")
    print(json.dumps(widget_data, indent=2, ensure_ascii=False))
    print("\n" + "=" * 50 + "\n")

    # Crear widget
    result = create_widget(widget_data)

    print("✅ Widget creado exitosamente!\n")
    print("Respuesta completa:")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    print("\n" + "=" * 50 + "\n")

    # Extraer el contenido formateado (markdown o content)
    content = result.get("markdown") or result.get("content")

    if content:
        print("📝 Contenido formateado (markdown/content):\n")
        print(content)
        print("\n" + "=" * 50 + "\n")
    else:
        print("⚠️  No se encontró campo 'markdown' o 'content' en la respuesta")


if __name__ == "__main__":
    main()


# ============================================
# Ejemplo más simple (una línea):
# ============================================

"""
import requests

response = requests.post(
    "https://frontend-production-d329.up.railway.app/api/widgets",
    json={
        "type": "chart",
        "title": "Ventas Mensuales 2025",
        "chartType": "bar",
        "labels": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
        "data": [12000, 15000, 18000, 22000, 25000, 27000]
    }
)

result = response.json()
print(result.get("markdown") or result.get("content"))
"""
