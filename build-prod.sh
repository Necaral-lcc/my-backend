#!/bin/bash 
pnpm install && pnpm run db:push:prod && pnpm run tsc:build