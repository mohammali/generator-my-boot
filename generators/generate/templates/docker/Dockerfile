FROM     openjdk:11-jre

MAINTAINER <%= maintainer %> <<%= email %>>

# Configure environment
ENV     APP_HOME /app
ENV     APP_BIN=${APP_HOME}/bin \
        APP_CONF=${APP_HOME}/conf \
        APP_LOGS=${APP_HOME}/logs \
        APP_USER=springboot \
        JMX_PORT=1098 \
        RMI_PORT=1099 \
        JAVA_DEBUG=false \
        APP_NAME=<%= appName %>

# Create user and group running application
RUN     groupadd -r ${APP_USER} && useradd -r -g ${APP_USER} ${APP_USER}

# Layout folders
RUN     mkdir ${APP_HOME} && \
        mkdir -m 0754 ${APP_BIN} && \
        mkdir -m 0740 ${APP_CONF} && \
        mkdir -m 0755 ${APP_LOGS} && \
        chown -R ${APP_USER}:${APP_USER} ${APP_HOME}

# Run as not-root
USER    ${APP_USER}

# Export logs
VOLUME  ${APP_LOGS}

# Expose JXM, RMI
EXPOSE  ${JMX_PORT} ${RMI_PORT}

WORKDIR ${APP_HOME}

# Add custom entrypoint script
COPY docker-entrypoint.sh /

# Install application
COPY target/<%= jarFileName %>.jar ${APP_BIN}

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["service"]
