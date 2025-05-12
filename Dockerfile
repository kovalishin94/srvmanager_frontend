FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY static/ /usr/share/nginx/static
COPY nginx.conf /etc/nginx/nginx.conf