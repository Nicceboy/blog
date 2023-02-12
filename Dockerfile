FROM archlinuxarm:latest

COPY mirrorlist /etc/pacman.d/mirrorlist

RUN ln -snf /usr/share/zoneinfo/Etc/UTC /etc/localtime && \
    # FIX https://github.com/moby/buildkit/issues/1267 \
    sed -i -e 's~#IgnorePkg.*~IgnorePkg = filesystem~g' '/etc/pacman.conf' && \
    echo "Etc/UTC" > /etc/timezone && \
    pacman-key --init && pacman-key --populate archlinuxarm && \
    pacman-key --refresh-keys && \
    yes | pacman -Sy --noconfirm archlinux-keyring && \
    yes | pacman -Syyu --noconfirm && \
    pacman -Sy --noconfirm texlive-most \
    zsh \
    grml-zsh-config \
    wget \
    vim \
    && pacman -Sc --noconfirm && \
    rm -rf /var/cache/pacman/pkg/ \
    && usermod --shell /bin/zsh alarm


ENV TLMGR /usr/share/texmf-dist/scripts/texlive/tlmgr.pl
RUN sed -i '/\$Master = "\$Master\/\.\.\/\.\.";/c     \$Master = "\${Master}\/\.\.\/\.\.\/\.\.";' $TLMGR

USER alarm
WORKDIR /home/alarm

RUN echo "alias tlmgr='${TLMGR} --usermode'" >> /home/alarm/.zshrc && \
    ${TLMGR} --usermode -v init-usertree && ${TLMGR} --usermode install ebgaramond setspace

ENTRYPOINT ["/bin/zsh"]

