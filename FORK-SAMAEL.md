# Fork local: focus pane or tab (Zellij-style)

Patch branch: `samael/focus-pane-or-tab`

## Qué hace

Nuevas keys en `[keys]` de `config.toml`:

- `focus_pane_or_tab_left` — pane izquierda en el tab actual; si no hay, tab anterior.
- `focus_pane_or_tab_right` — pane derecha; si no hay, tab siguiente.

Misma ruta que `focus_pane_*` / `previous_tab` (sin plugin, sin bash, sin delay de CLI).

## Build (requiere Zig)

Herdr compila `libghostty-vt` con Zig:

```bash
# Rust + Zig 0.15.2 (el zig de Arch 0.16 NO sirve)
curl -fL https://ziglang.org/download/0.15.2/zig-x86_64-linux-0.15.2.tar.xz -o /tmp/zig-0.15.2.tar.xz
tar -xJf /tmp/zig-0.15.2.tar.xz -C ~/.local/zig-0.15.2 --strip-components=1

export ZIG=$HOME/.local/zig-0.15.2/zig
cd ~/Escritorio/Programacion/personal/herdr
cargo build --release
```

Binario: `target/release/herdr`

## Usar el binario

1. Parar el server que usa el herdr del sistema (cierra clientes o `herdr server stop` si aplica).
2. Arrancar con el fork, por ejemplo:

   ```bash
   export PATH="$HOME/Escritorio/Programacion/personal/herdr/target/release:$PATH"
   herdr
   ```

   O symlink personal: `ln -sf .../target/release/herdr ~/.local/bin/herdr-fork`

3. En `~/.config/herdr/config.toml`:

   ```toml
   focus_pane_or_tab_left = "alt+h"
   focus_pane_or_tab_right = "alt+l"

   previous_tab = ["alt+left", "alt+p"]
   next_tab = ["alt+right"]
   ```

4. Quitar los `[[keys.command]]` de `zellij-style-nav` en `alt+h` / `alt+l` (y opcional `herdr plugin disable zellij-style-nav`).

5. `herdr server reload-config` o reiniciar sesión.

## AGPL

Uso solo en tu máquina: OK. Si redistribuís el binario, publicá el source del fork.

## Rebase en releases nuevas

```bash
git fetch origin
git rebase origin/master   # o la rama que use upstream
# resolver conflictos en los mismos archivos si cambian
cargo build --release
```

Archivos tocados por el patch:

- `src/app/actions.rs` — `navigate_pane_or_tab_horizontal`
- `src/app/input/navigate.rs` — `NavigateAction`, dispatch TUI + terminal
- `src/config/model.rs`, `src/config/keybinds.rs`
- `src/ui/keybind_help.rs`, `src/main.rs` (comentarios de ejemplo)