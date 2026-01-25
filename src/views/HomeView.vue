<script setup>
import { computed, ref } from 'vue';
import { useBookmarks } from '../composables/useBookmarks';
import { useRouter } from 'vue-router';

const router = useRouter();
const { bookmarks, deleteBookmark } = useBookmarks();
const selectedTag = ref(null);
const isMobileMenuOpen = ref(false);

const uniqueTags = computed(() => {
  const tags = new Set();
  bookmarks.value.forEach(b => {
    if (b.tags && b.tags.length > 0) {
      b.tags.forEach(t => tags.add(t));
    }
  });
  return Array.from(tags).sort();
});

const hasOtherBookmarks = computed(() => {
  return bookmarks.value.some(b => !b.tags || b.tags.length === 0);
});

const filteredBookmarks = computed(() => {
  if (!selectedTag.value) {
    if (selectedTag.value === '') return []; // Should not happen
    return bookmarks.value; // ALL
  }
  if (selectedTag.value === '___OTHER___') {
    return bookmarks.value.filter(b => !b.tags || b.tags.length === 0);
  }
  return bookmarks.value.filter(b => b.tags && b.tags.includes(selectedTag.value));
});

const handleDelete = (id) => {
  if (confirm('Are you sure you want to delete this bookmark?')) {
    deleteBookmark(id);
  }
};

const selectTag = (tag) => {
  selectedTag.value = tag;
  isMobileMenuOpen.value = false; // Close drawer on mobile
};
</script>

<template>
  <div class="home-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <button class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <span class="icon">≡</span>
        </button>
        <h1>My Bookmark</h1>
      </div>
      <div class="header-right">
        <router-link to="/add" class="icon-btn tooltippable" title="Add Bookmark">📝</router-link>
        <router-link to="/config" class="icon-btn tooltippable" title="Config">⚙️</router-link>
      </div>
    </header>

    <div class="main-content">
      <!-- Sidebar / Drawer -->
      <aside class="sidebar" :class="{ 'is-open': isMobileMenuOpen }">
        <div class="sidebar-inner">
          <div 
            class="tag-item" 
            :class="{ active: selectedTag === null }"
            @click="selectTag(null)"
          >
            All Bookmarks
          </div>
          
          <div class="tag-header">▼ Tags</div>
          
          <div 
            v-for="tag in uniqueTags" 
            :key="tag" 
            class="tag-item"
            :class="{ active: selectedTag === tag }"
            @click="selectTag(tag)"
          >
            {{ tag }}
          </div>

          <div 
            v-if="hasOtherBookmarks"
            class="tag-item"
            :class="{ active: selectedTag === '___OTHER___' }"
            @click="selectTag('___OTHER___')"
          >
            Other
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile drawer -->
      <div class="overlay" v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"></div>

      <!-- Bookmark List -->
      <main class="bookmark-list">
        <div v-if="filteredBookmarks.length === 0" class="empty-state">
          No bookmarks found.
        </div>
        
        <div 
          v-for="item in filteredBookmarks" 
          :key="item.id" 
          class="bookmark-card fade-in"
        >
          <div class="card-content">
            <h2 class="bookmark-title">{{ item.title }}</h2>
            <div class="bookmark-meta">
              <a :href="item.url" target="_blank" class="bookmark-url">{{ item.url }}</a>
              
              <div class="bookmark-actions">
                <router-link :to="`/edit/${item.id}`" class="action-btn">Edit</router-link>
                <span class="separator">|</span>
                <button @click="handleDelete(item.id)" class="action-btn delete-btn">Delete</button>
              </div>
            </div>
            <div class="tags-row" v-if="item.tags && item.tags.length">
               <span v-for="tag in item.tags" :key="tag" class="tag-badge">{{ tag }}</span>
            </div>
          </div>
        </div>
        
        <!-- Scroll to top could be implemented here or globally -->
      </main>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-right {
  display: flex;
  gap: 1rem;
}

h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent-primary);
  letter-spacing: -0.025em;
}

.icon-btn {
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  background: transparent;
}

.icon-btn:hover {
  background-color: var(--color-bg-tertiary);
  transform: translateY(-2px);
}

.mobile-menu-btn {
  background: none;
  color: var(--color-text-primary);
  font-size: 1.5rem;
  display: none; /* Hidden on PC */
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  transition: transform 0.3s ease;
  z-index: 40;
}

.sidebar-inner {
  padding: 1.5rem;
}

.tag-header {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.tag-item {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text-secondary);
}

.tag-item:hover, .tag-item.active {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--color-accent-primary);
}

.tag-item.active {
  font-weight: 600;
  border-left: 3px solid var(--color-accent-primary);
}

/* List Area */
.bookmark-list {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: var(--color-bg-primary);
}

.bookmark-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  padding: 1.25rem;
  transition: all 0.2s;
}

.bookmark-card:hover {
  border-color: var(--color-accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.bookmark-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
}

.bookmark-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.bookmark-url {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-decoration: none;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

.bookmark-url:hover {
  text-decoration: underline;
  color: var(--color-accent-primary);
}

.bookmark-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  background: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: color 0.2s;
}

.action-btn:hover {
  color: var(--color-accent-primary);
  background-color: rgba(255,255,255,0.05);
}

.delete-btn:hover {
  color: var(--color-danger);
}

.separator {
  color: var(--color-border);
}

.tags-row {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag-badge {
  font-size: 0.75rem;
  padding: 0.2em 0.6em;
  border-radius: 999px;
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    box-shadow: var(--shadow-xl);
  }

  .sidebar.is-open {
    transform: translateX(0);
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 30;
    backdrop-filter: blur(2px);
  }

  .bookmark-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .bookmark-url {
    max-width: 100%;
  }

  .bookmark-actions {
    width: 100%;
    margin-top: 0.5rem;
    justify-content: flex-end;
  }
}
</style>
