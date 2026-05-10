export const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN_ROOM: 'join_room',

    NEW_ORDER: 'new_order',
    ORDER_STATUS_UPDATE: 'order_status_update',

    STOCK_UPDATE: 'stock_update',
} as const;