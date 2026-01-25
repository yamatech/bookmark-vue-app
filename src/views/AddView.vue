<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBookmarks } from '../composables/useBookmarks';

const router = useRouter();
const { addBookmark } = useBookmarks();

const title = ref('');
const url = ref('');
const tags = ref('');

const errors = ref({});

const validate = () => {
  errors.value = {};
  let isValid = true;
  
  if (!title.value.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  }
  
  if (!url.value.trim()) {
    errors.value.url = 'URL is required';
    isValid = false;
  } else if (!/^https?:\/\//.test(url.value.trim())) {
    errors.value.url = 'URL must start with http:// or https://';
    isValid = false;
  }

  return isValid;
};

const submit = () => {
  if (validate()) {
    const tagArray = tags.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
      
    addBookmark({
      title: title.value.trim(),
      url: url.value.trim(),
      tags: tagArray
    });
    
    router.push('/');
  }
};

const cancel = () => {
  router.push('/');
};
</script>

<template>
  <div class="page-container">
    <div class="page-card fade-in">
       <header class="card-header">
         <h1>Add bookmark 📝</h1>
       </header>
       
       <form @submit.prevent="submit" class="card-body">
         <div class="form-group">
           <label>Title <span class="required">*</span></label>
           <input 
             v-model="title" 
             type="text" 
             placeholder="Web Site Title"
             :class="{ 'has-error': errors.title }"
           >
           <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
         </div>
         
         <div class="form-group">
           <label>URL <span class="required">*</span></label>
           <input 
             v-model="url" 
             type="text" 
             placeholder="https://example.com/"
             :class="{ 'has-error': errors.url }"
           >
           <span v-if="errors.url" class="error-msg">{{ errors.url }}</span>
         </div>
         
         <div class="form-group">
           <label>Tags</label>
           <input 
             v-model="tags" 
             type="text" 
             placeholder="Vue, Tech, Learn (comma separated)"
           >
         </div>
         
         <div class="form-actions">
            <button type="button" @click="cancel" class="btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Add</button>
         </div>
       </form>
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
}

.card-header h1 {
  font-size: 1.5rem;
  color: var(--color-text-primary);
}

.card-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.required {
  color: var(--color-danger);
}

.error-msg {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-danger);
}

.has-error {
  border-color: var(--color-danger) !important;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
