path "auth/*" {
  capabilities = ["create", "update", "read", "delete", "list"]
}

path "sys/auth/*" {
  capabilities = ["create", "update", "read", "delete", "list"]
}

path "auth/userpass/*" {
  capabilities = [ "create", "read", "update", "delete" ]
}
