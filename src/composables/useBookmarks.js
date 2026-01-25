import { ref, watch } from 'vue';

const STORAGE_KEY = 'my_bookmarks_v1';

export function useBookmarks() {
  const bookmarks = ref([]);
  const error = ref(null);

  // Initialize
  const loadBookmarks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        bookmarks.value = JSON.parse(stored);
      } else {
        bookmarks.value = [];
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
      error.value = 'Failed to load data';
      bookmarks.value = [];
    }
  };

  const saveBookmarks = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
      error.value = 'Failed to save data';
    }
  };

  // Watch for changes to auto-save (Optional, but handy, though we might want explicit save for control)
  // For this spec, explicit save after action is safer. I will call saveBookmarks in actions.

  const addBookmark = (bookmark) => {
    const newBookmark = {
      id: Date.now(),
      title: bookmark.title,
      url: bookmark.url,
      tags: bookmark.tags || []
    };
    bookmarks.value.unshift(newBookmark);
    saveBookmarks();
  };

  const updateBookmark = (id, updatedData) => {
    const index = bookmarks.value.findIndex(b => b.id === Number(id));
    if (index !== -1) {
      bookmarks.value[index] = {
        ...bookmarks.value[index],
        ...updatedData,
        id: Number(id) // Ensure ID doesn't change
      };
      saveBookmarks();
    }
  };

  const deleteBookmark = (id) => {
    bookmarks.value = bookmarks.value.filter(b => b.id !== Number(id));
    saveBookmarks();
  };

  const getBookmarkById = (id) => {
    return bookmarks.value.find(b => b.id === Number(id));
  };

  const deleteAllBookmarks = () => {
    bookmarks.value = [];
    localStorage.removeItem(STORAGE_KEY);
  };

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        // Simple validation
        const isValid = parsed.every(item => item.id && item.title && item.url);
        if (isValid) {
          bookmarks.value = parsed;
          saveBookmarks();
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Load initially
  loadBookmarks();

  return {
    bookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    getBookmarkById,
    deleteAllBookmarks,
    importData,
    loadBookmarks // exposed if needed to re-read
  };
}
