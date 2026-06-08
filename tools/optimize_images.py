from pathlib import Path

from PIL import Image


TARGETS = {
    "01-hero-card-01.png": 1100,
    "02-about-card-01.png": 900,
    "02-about-card-02.png": 900,
    "02-about-card-03.png": 900,
    "04-projects-01-image-Col1image1.png": 900,
    "04-projects-01-image-Col1image2.png": 900,
    "04-projects-01-image-Col2.png": 900,
    "04-projects-02-image-Col1image1.png": 1100,
    "04-projects-02-image-Col1image2.png": 1100,
    "04-projects-02-image-Col2.png": 1100,
    "04-projects-03-image-Col1image1.png": 1100,
    "04-projects-03-image-Colimage2.png": 900,
    "04-projects-03-image-Col2.png": 900,
    "05-marquee-image-01.png": 1200,
    "05-marquee-image-02.png": 1000,
    "05-marquee-image-03.png": 1200,
    "05-marquee-image-04.png": 1200,
    "05-marquee-image-05.png": 1200,
    "05-marquee-image-06.png": 1100,
    "05-marquee-image-07.png": 1100,
    "05-marquee-image-08.png": 1000,
    "05-marquee-image-09.png": 1100,
}


def main() -> None:
    source_dir = Path("assets")
    output_dirs = [source_dir / "optimized", Path("public") / "assets" / "optimized"]
    for output_dir in output_dirs:
        output_dir.mkdir(parents=True, exist_ok=True)
    rows = []

    for filename, max_side in TARGETS.items():
        source = source_dir / filename
        outputs = [output_dir / f"{source.stem}.webp" for output_dir in output_dirs]
        with Image.open(source) as image:
            image.load()
            image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            for output in outputs:
                image.save(output, "WEBP", quality=82, method=6)
        rows.append((outputs[0].name, outputs[0].stat().st_size / 1024, outputs[0]))

    for name, kb, _ in sorted(rows, key=lambda row: row[1], reverse=True):
        print(f"{name}\t{kb:.1f} KB")


if __name__ == "__main__":
    main()
