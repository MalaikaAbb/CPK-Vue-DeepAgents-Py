"""
[harness] NOT FROM THE DOCS — the graph this repo serves as `sample_agent`
(langgraph.harness.json → ./harness_agent.py:agent). Added at the user's
request ("Add a flagged product tool").

It is the Deep Agents Quickstart's main.py, imported unchanged, with ONE extra
tool, `get_products`. Why: the Catalogs page's shop catalog (also used by
Surfaces) describes ProductCard as "Copy every value from a product of a tool
result", but no doc page publishes a product tool, so the model refused to
render products. `get_products` is a STAND-IN returning fixed sample products.

How: while main.py is imported, `create_deep_agent` is wrapped so the call
main.py makes gets `get_products` appended to its `tools`. Every other argument
(model, get_weather, CopilotKitMiddleware, system prompt) comes from main.py
as published. The wrapper is removed again right after the import.
"""
import deepagents

# A grey 160x120 placeholder image, inline so nothing is fetched.
_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='120'%3E%3Crect width='160' height='120' fill='%23cbd5e1'/%3E%3C/svg%3E"

_PRODUCTS = [
    {"id": "p-1", "name": "Trail Runner", "price": 120, "imageUrl": _IMAGE},
    {"id": "p-2", "name": "City Sneaker", "price": 90, "imageUrl": _IMAGE},
    {"id": "p-3", "name": "Court Classic", "price": 75, "imageUrl": _IMAGE},
]


def get_products():
    """Get the products in the shop: each has an id, name, price (USD) and imageUrl."""
    # [harness] STAND-IN — fixed sample data, no network.
    return _PRODUCTS


_create_deep_agent = deepagents.create_deep_agent


def _with_product_tool(*args, tools=(), **kwargs):
    return _create_deep_agent(*args, tools=[*tools, get_products], **kwargs)


deepagents.create_deep_agent = _with_product_tool
try:
    from main import agent  # noqa: E402 — the Quickstart graph, built with the extra tool
finally:
    deepagents.create_deep_agent = _create_deep_agent
