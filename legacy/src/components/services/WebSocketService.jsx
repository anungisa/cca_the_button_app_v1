class WebSocketManager {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscribers = new Map();
  }

  connect(userToken) {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    try {
      // In production, this would connect to your WebSocket server
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://api.thebutton.ca/ws' 
        : 'ws://localhost:8080/ws';
      
      this.socket = new WebSocket(`${wsUrl}?token=${userToken}`);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect(userToken);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    if (this.subscribers.has(type)) {
      this.subscribers.get(type).forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in WebSocket subscriber for ${type}:`, error);
        }
      });
    }
  }

  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }

  send(type, payload) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected, message not sent:', { type, payload });
    }
  }

  attemptReconnect(userToken) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Attempting WebSocket reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(userToken);
      }, delay);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.subscribers.clear();
  }
}

export const WebSocketService = new WebSocketManager();