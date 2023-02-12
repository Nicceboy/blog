## A blog based on Hugo and PaperMod them

### Development

Add theme as submodule

```cosole
git submodule add --depth=1 git@github.com:Nicceboy/hugo-PaperMod.git
submodule update --init --recursive
```

### Highlighting

Generate missing styles, Monokai for example
Related [issue.](https://github.com/adityatelange/hugo-PaperMod/issues/1046)

```sh
hugo gen chromastyles --style monokai --highlightStyle 'bg:#474733' > assets/css/extended/monokai.css
```

### TODO

Maybe add hamburger menu 

https://codepen.io/erikterwan/pen/EVzeRP
