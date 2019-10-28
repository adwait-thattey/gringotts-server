path "gringotts-user/{{identity.entity.name}}/*" {
  capabilities = [ "create", "update", "read", "delete", "list" ]
}

path "auth/userpass/users/{{identity.entity.aliases.auth_userpass_fed057e5.name}}" {
  capabilities = [ "create", "update", "read" ]
  allowed_parameters = {
    "password" = []
  }
}