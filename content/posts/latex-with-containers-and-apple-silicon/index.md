---
title: "LaTeX with OCI containers, Podman and Arch Linux ARM on Apple Silicon"
summary: "This blog post introduces a brief overview of how to set up a container runner on your ARM Macbook and how to create an AArch64 Open Container Initiative (OCI) container image from the scratch."
date: 2023-02-11
draft: true
tags: ["containers", "podman", "docker", "mac", "arm", "latex", "oci"]
author: Niklas Saari
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: true
hidemeta: false
comments: false
description: "Building and using ARM-based OCI images on Apple Silicon from scratch. LaTeX document preparation system used as an example."
disableShare: false
disableHLJS: true
hideSummary: false
searchHidden: false 
ShowReadingTime: true
ShowBreadCrumbs: false
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
params:
    ShowBreadCrumbs: true
cover:
    image: "latex.svg"
    alt: "LaTeX logo"
    # caption: "Magic The Gathering: Arena works well when played from the Linux container." -->
    relative: true # when using page bundles set this to true
    hidden: false # only hide on current single page
editPost:
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---

Since the release of Apple's M1 Chips, ARM architecture has expanded to a larger user base.
The power efficiency and performance of the new chips have made them quite desirable.
Unfortunately, most of the existing advanced developer-required toolchains were for x86_64 architecture in many cases.

This blog post introduces a brief overview of how to set up a container runner on your ARM Macbook and how to create an AArch64 [Open Container Initiative (OCI)](https://opencontainers.org/about/overview/) container image from the scratch.

<!-- Especially, by using Buildah to build the image and Podman to run it. -->

The example builds $\rm\TeX$ Live for $\rm\LaTeX$ since I could not find an existing up-to-date image after I sold my soul to the devil by getting M2 Apple device.

There **might** be (there are) simpler ways to build LaTeX documents on your Macbook, but this gives us the most control in a reproducible environment!

## Selecting a container runner

There are already quite many options to run OCI containers on ARM and MacOS.
The obvious choice would be [*Docker Desktop on Mac*](https://docs.docker.com/desktop/install/mac-install/), but we might not want yet-another Chromium instance to consume battery. 
We also like open-source software.

All of the current options are QEMU based since containers are based on the Linux kernel: 
  * [Colima](https://github.com/abiosoft/colima) as a minimal CLI-based daemon (containerd/dockerd) with [Lima](https://github.com/lima-vm/lima)
  * [Finch](https://github.com/runfinch/finch) is [AWS](https://aws.amazon.com/blogs/opensource/introducing-finch-an-open-source-client-for-container-development/) backed and aims to bring a native client on MacOS for nerdctl and containerd with Lima. Includes core features and there is development to do.
  * [Podman](https://podman.io/getting-started/installation) (No daemon, based on libpod)
  * [Podman Desktop](https://podman-desktop.io/) (GUI, no daemon, based on libpod)
  * [Rancher](https://rancherdesktop.io/) (GUI, containerd/dockerd and Lima)

As noted, regardless of the selection, we need a VM instance to run our Linux kernel.

As daemonless and rootless option, in this blog, we use Buildah to build our images, and Podman to run them.

## Podman and Buildah

Podman can be installed by using [Homebrew](https://formulae.brew.sh/formula/podman) or [Nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/virtualization/podman/default.nix).
Podman can build OCI images from the `Dockerfile`.
There is an advanced tool called [_Buildah_](https://buildah.io/), but unfortunately, Buildah cannot be directly used, as it is for Linux only.
Some of the features will work on MacOS (if installed with Nix), but not all of them, and images will be separated from the Podman VM.

Podman `build` command uses a subset of Buildah and it is sufficient for our needs for now; `podman build` is equivalent to `buildah build -f Dockerfile` 
For advanced use of Buildah, I might make another post for demonstration purposes when we will build our OCI image without `Dockerfile` in MacOS.
Buildah can be used from the VM or inside another container.

## Installing Podman on Mac

We will use [Nix](https://nixos.org/manual/nix/stable/package-management/basic-package-mgmt.html) to install QEMU and Podman.

```sh
nix-env -iA nixpkgs.qemu nixpkgs.podman 
```

Before anything works, we need to set up a virtual machine.
At this point, it is important to note that you cannot mount folders into the containers unless you mount them into the VM too.
So double mount is required; mount the folder into the VM, and mount the folder from VM into the container.

You could either mount a specific limited directory into the machine or the whole home directory.
Mounting the whole home directory might not be advised, but I will do it for demonstration purposes.
CPU count and memory size has been also increased.

```sh
podman machine init -m 4096 --cpus 2 -v "$HOME:$HOME"
podman machine start
podman info
```
The final command should showcase that we are indeed running CoreOS on ARM instructions inside a VM:

```sh
host:
  arch: arm64
  buildahVersion: 1.28.0
  cgroupControllers:
  - cpu
  - io
  - memory
  - pids
.
.
  distribution:
    distribution: fedora
    variant: coreos
    version: "37"
.
.
.
```

## Creating Arch Linux image from scratch

Arch Linux has an excellent wiki and collection of up-to-date packages.
For that reason, we install LaTeX on that distribution.
However, there is no official container image for ARM-based Arch Linux.

We can create a base image from the scratch; we download the official AArch64 [multiplatform release](https://archlinuxarm.org/about/downloads), and since Linux is purely a file-based system, we just import the contents into the container, and it should work.

```bash
curl -L http://os.archlinuxarm.org/os/ArchLinuxARM-aarch64-latest.tar.gz | podman import - archlinuxarm
```
This will create a new image with the namespace `localhost/archlinuxarm:latest`. 

You can try it out
```bash
podman run --rm -it archlinuxarm bash
```

## $\rm\TeX$ Live image

The constant change of indexes is a problem with the use of Arch Linux in containers.
If the container base is not updated for a while, there will be conflicts.
The release of packages requires PGP signatures, and new authors will bring new keys.
Sometimes keys change or deprecate, too.
The following image takes this into account and should be able to update its keyring automatically.
For security reasons, this is often recommended to do manually, but we will trust Arch Linux maintainers and supply chain for now. 

Since we are going to build documents, the correct time might be important.
We will make it possible to guarantee the correct timezone.

We might also want to install additional [CTAN](https://ctan.org/) packages, which are not included in the Arch Linux repository.
For that, we need The TeXLive Package Manager (tlmgr), which is often challenging to install.
The following example installs *EB Garamond font* and *setspace* package.

```Dockerfile {linenos=true}
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

# Folder as mountpoint with correct permissions
RUN mkdir /latex && chown alarm:alarm /latex

USER alarm
WORKDIR /home/alarm

RUN echo "alias tlmgr='${TLMGR} --usermode'" >> /home/alarm/.zshrc && \
    ${TLMGR} --usermode -v init-usertree && ${TLMGR} --usermode install ebgaramond setspace

ENTRYPOINT ["/bin/zsh"]
```

Generated image will have the latest TeX Live distribution with a working package manager and desired default timezone.
On runtime, the timezone can also be changed to `-e TZ=Europe/Amsterdam` Podman parameter.


## Elsevier template as an example

As an example, we will build Elsevier template.
The template is provided [in here.](https://www.elsevier.com/authors/policies-and-guidelines/latex-instructions)

We will download and extract it.
```bash
curl -OL https://www.elsevier.com/__data/assets/file/0007/56842/elsarticle-template.zip && 7z x elsarticle-template.zip
```

Mount the source into our container.
Note the ``--userns`` option; it maps the ownership of the volume inside the container to the correct user.

```bash
podman run --userns=keep-id:uid=1000,gid=1000 --rm -itv "$(pwd)/elsarticle:/latex" texlive:latest
```

To build our document with LuaLatex and detect new changes

```bash
cd /elsarticle
latexmk -pdflatex=lualatex  -pdf -pvc dimain.tex
```

{{< details "Using Buildah" >}}
  

### Installing Buildah

To see the name of the machine

```sh
podman machine list                                                           130 ↵
NAME                     VM TYPE     CREATED            LAST UP            CPUS        MEMORY      DISK SIZE
podman-machine-default*  qemu        About an hour ago  Currently running  1           2.147GB     107.4GB
```

Podman default machine uses Fedore CoreOS which is immutable and atomic by nature.
To install additional packages, we need to use a specific package manager to add additional layers for the base VM.

Connect to the VM
```sh
podman machine ssh podman-machine-default # Connect to VM
```
Install Buildah

```sh
sudo rpm-ostree install buildah
systemctl reboot # reboot to make changes effective
```

{{< /details >}}
