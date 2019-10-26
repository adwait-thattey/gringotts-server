FROM vault

COPY ./config /vault/config

COPY vault-entrypoint.sh /vault/vault-entrypoint.sh

#EXPOSE 8200
ENTRYPOINT ["/vault/vault-entrypoint.sh"]
