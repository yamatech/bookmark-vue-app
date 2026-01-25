<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBookmarks } from '../composables/useBookmarks';

const router = useRouter();
const { bookmarks, importData, deleteAllBookmarks } = useBookmarks();
const fileInput = ref(null);

const goBack = () => {
  router.push('/');
};

const handleExport = () => {
  const dataStr = JSON.stringify(bookmarks.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bookmarks.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const triggerFileSelect = () => {
  fileInput.value.click();
};

const handleImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const success = importData(e.target.result);
    if (success) {
      alert('Backup data restored successfully.');
    } else {
      alert('Failed to restore data. Invalid file format.');
    }
    // reset input
    event.target.value = '';
  };
  reader.readAsText(file);
};

const handleDeleteAll = () => {
  if (confirm('Are you sure you want to delete ALL bookmarks? This action cannot be undone.')) {
    deleteAllBookmarks();
    alert('All bookmarks deleted.');
  }
};
</script>

<template>
  <div class="page-container">
    <div class="page-card fade-in">
      <header class="card-header header-with-back">
        <button @click="goBack" class="back-btn">← Back</button>
        <h1>Config ⚙️</h1>
      </header>
      
      <div class="card-body">
        
        <!-- Export -->
        <section class="config-section">
          <h2>1. Backup Bookmark Data (Export)</h2>
          <p>Download a backup of your bookmarks in JSON format.</p>
          <button @click="handleExport" class="btn btn-primary">Save Data (JSON)</button>
        </section>

        <hr class="divider">

        <!-- Import -->
        <section class="config-section">
          <h2>2. Import Bookmark Data (Restore)</h2>
          <p>Restore data from a backup JSON file. <strong>Current data will be overwritten.</strong></p>
          <input 
            type="file" 
            ref="fileInput" 
            accept=".json" 
            style="display: none" 
            @change="handleImport"
          >
          <button @click="triggerFileSelect" class="btn">Select JSON File</button>
        </section>

        <hr class="divider">

        <!-- Delete All -->
        <section class="config-section">
          <h2 class="danger-text">3. Delete All Bookmark</h2>
          <p>Delete all stored bookmarks permanently.</p>
          <button @click="handleDeleteAll" class="btn btn-danger">Delete All</button>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
  min-height: 100vh;
}

.page-card {
  width: 100%;
  max-width: 600px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
  height: fit-content;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-with-back h1 {
  font-size: 1.5rem;
  color: var(--color-text-primary);
}

.back-btn {
  background: none;
  font-size: 1rem;
  color: var(--color-accent-primary);
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.back-btn:hover {
  background-color: rgba(99, 102, 241, 0.1);
}

.card-body {
  padding: 2rem;
}

.config-section {
  padding: 1rem 0;
}

.config-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
}

.config-section p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.divider {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: 1rem 0;
}

.danger-text {
  color: var(--color-danger) !important;
}
</style>
