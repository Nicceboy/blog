FROM archlinuxarm:latest

# If you want to use custom mirror to download packages instead of the automatic geolocation
# COPY mirrorlist /etc/pacman.d/mirrorlist

# Define timezone for container
ENV TZ=Europe/Helsinki

RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && \
    echo "$TZ" > /etc/timezone && \
    # If you are using BuildKIt instead of Buildah, see https://github.com/moby/buildkit/issues/1267 \
    # sed -i -e 's~#IgnorePkg.*~IgnorePkg = filesystem~g' '/etc/pacman.conf' && \
    # /etc/hosts and /etc/resolv.conf are read-only, filesystem package attempts to modify them
    pacman-key --init && pacman-key --populate archlinuxarm && \
    pacman-key --refresh-keys && \
    yes | pacman -Sy --noconfirm archlinux-keyring && \
    yes | pacman -Syyu --noconfirm && \
    pacman -S --noconfirm texlive-most \
    zsh \
    grml-zsh-config \
    wget \
    vim \
    # Reduce image size \
    && pacman -Sc --noconfirm && \
    rm -rf /var/cache/pacman/pkg/ \
    && usermod --shell /bin/zsh alarm

ENV TLMGR /usr/share/texmf-dist/scripts/texlive/tlmgr.pl
# For some reason, default tlmgr.pl contex filepath is in wrong location in Arch Linux 
RUN sed -i '/\$Master = "\$Master\/\.\.\/\.\.";/c     \$Master = "\${Master}\/\.\.\/\.\.\/\.\.";' $TLMGR

USER alarm
WORKDIR /home/alarm

RUN echo "alias tlmgr='${TLMGR} --usermode'" >> /home/alarm/.zshrc && \
    ${TLMGR} --usermode -v init-usertree && ${TLMGR} --usermode install ebgaramond setspace

ENTRYPOINT ["/bin/zsh"]

