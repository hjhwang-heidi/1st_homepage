{
  "entities": {
    "GuestbookEntry": {
      "title": "GuestbookEntry",
      "description": "A message left by a guest in the guestbook.",
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the guest."
        },
        "content": {
          "type": "string",
          "description": "The message content."
        },
        "createdAt": {
          "type": "string",
          "format": "date-time",
          "description": "The time the entry was created."
        }
      },
      "required": ["name", "content", "createdAt"]
    }
  },
  "firestore": {
    "guestbook": {
      "schema": "GuestbookEntry",
      "description": "Collection of guestbook entries."
    }
  }
}
