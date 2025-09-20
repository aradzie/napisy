#!/usr/bin/env bash

for file in blacklist-*.txt; do
    sort "${file}" > "${file}.sorted" && mv "${file}.sorted" "${file}"
done
