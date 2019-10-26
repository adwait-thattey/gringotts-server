#!/bin/sh

set -e

export VAULT_ADDR='http://127.0.0.1:8200'

vault server -config=/vault/config &
sleep 3
vault operator init

echo "Vault is initialized. Use unseal keys to unlock the vault."

wait