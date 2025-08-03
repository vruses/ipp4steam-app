type OrderGraph = [number, number, string] // [price, amount, summary];
export interface ItemOrdersInfo {
  buy_order_summary: string
  buy_order_table: string
  buy_order_graph: OrderGraph[]
  sell_order_summary: string
  sell_order_table: string
  sell_order_graph: OrderGraph[]
  graph_max_x: number
  graph_max_y: number
  graph_min_x: number
  price_prefix: string
  price_suffix: string
  highest_buy_order: string | null
  lowest_sell_order: string | null
  success: number
}
export interface ItemInfo {
  itemID: string //item_nameid
  itemName: string
  lowestSellPrice: string
}

export interface ItemInfoLog {
  itemID: string
  itemName: string
  orderGraph: OrderGraph
}
