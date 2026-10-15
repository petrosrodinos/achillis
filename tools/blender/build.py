"""Build every model, validate, and optionally render previews.

Run (any Blender 4.4+/5.x, headless):
    blender -b --factory-startup -P tools/blender/build.py -- [--only humanoid,horse] [--preview] [--no-validate]

Each asset is built in its own Blender subprocess so every build starts from a clean scene.
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
MODELS = os.path.join(REPO, "app", "public", "assets", "models")

ASSETS = {
    "humanoid": ("build_humanoid.py", "humanoid.glb"),
    "horse": ("build_horse.py", "horse.glb"),
}


def blender():
    import bpy
    return bpy.app.binary_path


def run(script, *args):
    cmd = [blender(), "-b", "--factory-startup", "-P", os.path.join(HERE, script), "--", *args]
    print("[build] $", " ".join(cmd))
    res = subprocess.run(cmd)
    if res.returncode != 0:
        raise SystemExit("[build] %s failed (%d)" % (script, res.returncode))


def main():
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    only = None
    if "--only" in args:
        only = args[args.index("--only") + 1].split(",")
    for name, (script, out) in ASSETS.items():
        if only and name not in only:
            continue
        run(script, os.path.join(MODELS, out))
    if "--no-validate" not in args:
        run("validate.py", os.path.join(MODELS, "humanoid.glb"), os.path.join(MODELS, "horse.glb"))
    if "--preview" in args:
        run("render_preview.py", "--set", "all")


if __name__ == "__main__":
    main()
