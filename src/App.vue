<template>
  <div class="host-app">
    <button @click="sortEmails" class="sort-button">Sort Emails</button>
    <div class="component-container">
      <EmailList
        class="component"
        v-model:emails="emails"
        @all-selected-emails-changed="onAllSelectedEmailsChanged"
        @email-selected-changed="onEmailSelectedChanged"
      />
      <SelectedList
        class="component"
        v-model:selected-emails="selectedEmails"
        ref="selectedList"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import emailsDataSource from "../data/emails.json";
import EmailList from "emailList/EmailList";
import SelectedList from "selectedList/SelectedList";

const emails = ref(emailsDataSource);

const selectedEmails = ref([]);

const onEmailSelectedChanged = (email) => {
  const index = selectedEmails.value.findIndex(
    (selectedEmail) => selectedEmail.address === email.address
  );
  const shouldRemoveEmail = !email.selected && index !== -1;
  if (shouldRemoveEmail) {
    selectedEmails.value.splice(index, 1);
  } else {
    selectedEmails.value.push(email);
  }
};

const onAllSelectedEmailsChanged = (selected) => {
  emails.value = emails.value.map((email) => ({
    ...email,
    selected,
  }));
  if (selected) {
    selectedEmails.value = emails.value;
  } else {
    selectedEmails.value = [];
  }
};

const sortEmails = () => {
  window.dispatchEvent(new Event("sortEmails"));
};
</script>

<style>

.host-app {
  color: #32af32 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sort-button {
  margin: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.component-container {
  display: flex;
  justify-content: center;
}

.component {
  margin: 0 10px;
  border: 1px solid #ccc;
  width: 600px;
  height: 400px;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

tr.selected {
  background-color: #d0e7ff;
}

input[type="checkbox"] {
  margin-right: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 8px;
  margin: 4px 0;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
