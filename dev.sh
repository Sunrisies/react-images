#!/bin/bash
pnpm run build
tar -czvf dist.tar.gz dist

scp dist.tar.gz root@blog.chaoyang1024.top:/home/www/blog/dashboard/
ssh root@blog.chaoyang1024.top "cd /home/www/blog/admin/ && rm -rf dist && tar -xzvf dist.tar.gz && rm -rf dist.tar.gz"
