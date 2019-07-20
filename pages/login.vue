<template>
  <b-form @submit.prevent="handleLogIn()">
    <b-form-group
      id="username-input-group"
      label="Username:"
      label-for="username-input"
      description="Enter the username you signed up with"
    >
      <b-form-input
        id="username-input"
        ref="username"
        v-model="username"
        :state="usernameOk"
        required
        placeholder="Enter Username"
        @change="checkUsername()"
      />
    </b-form-group>

    <b-form-group
      id="password-input-group"
      label="Choose a Password:"
      label-for="password-input"
      description="Use a strong password, and never one you've used elsewhere"
    >
      <b-form-input
        id="password-input"
        ref="password"
        v-model="password"
        :state="passwordOk"
        type="password"
        required
        placeholder="Enter Password"
      />
      <b-form-invalid-feedback :state="passwordOk">
        <p v-if="passwordTooLong">
          Your password cannot be longer than 71 characters.
        </p>
      </b-form-invalid-feedback>
    </b-form-group>
  </b-form>
</template>
