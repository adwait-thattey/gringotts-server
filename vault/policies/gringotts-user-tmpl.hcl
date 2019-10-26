path "gringotts-user/{{identity.entity.name}}/*" {
  capabilities = [ "create", "update", "read", "delete", "list" ]
}
