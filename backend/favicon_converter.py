import base64
import zipfile
from io import BytesIO
from PIL import Image
import svgwrite
import json
import boto3
from dotenv import load_dotenv
import uuid


def lambda_handler(event, context):
    # Lambdaのエントリポイント
    source_image_path = event['source_image_path']
    return convert_favicon(source_image_path)

def convert_favicon(base64_image):
    # Base64デコードして画像を生成
    image_data = base64.b64decode(base64_image)
    image = Image.open(BytesIO(image_data))

    # ZIPファイルを作成
    zip_io = BytesIO()
    with zipfile.ZipFile(zip_io, 'w') as zip_file:
        # PNG 180x180
        png_180x180 = image.resize((180, 180))
        add_to_zip(zip_file, png_180x180, "apple-touch-icon.png", 'PNG')

        # PNG 192x192
        png_192x192 = image.resize((192, 192))
        add_to_zip(zip_file, png_192x192, "icon-192.png", 'PNG')

        # PNG 512x512
        png_512x512 = image.resize((512, 512))
        add_to_zip(zip_file, png_512x512, "icon-512.png", 'PNG')

        # SVG
        svg = png2svg(base64_image)
        zip_file.writestr("icon.svg", svg)

        # ICO 30x30
        ico_30x30 = image.resize((30, 30))
        add_to_zip(zip_file, ico_30x30, "favicon.ico", 'ICO')
        
        # Manifestファイルを追加
        manifest_content = {
            "icons": [
                {"src": "/icon-192.png", "type": "image/png", "sizes": "192x192"},
                {"src": "/icon-512.png", "type": "image/png", "sizes": "512x512"}
            ]
        }
        manifest_json = json.dumps(manifest_content, indent=2)
        zip_file.writestr("manifest.webmanifest", manifest_json)  # ManifestファイルをZIPに追加

    zip_io.seek(0)
    
    # S3にアップロード
    load_dotenv()
    client = boto3.client('s3')
    unique_id = str(uuid.uuid4())  # UUIDを生成
    Bucket = 'forzipbucket'
    Key = f'favicon_{unique_id}.zip'  # 一意なキーを設定
    client.upload_fileobj(zip_io, Bucket, Key)

    # ダウンロードリンクを生成
    download_link = f"https://{Bucket}.s3.amazonaws.com/{Key}"
    return {"download_link": download_link}

def png2svg(base64_image, output_filename='icon.svg'):
    # PNG画像をSVGに変換する
    dwg = svgwrite.Drawing(output_filename)
    dwg.add(dwg.image('data:image/png;base64,' + base64_image.decode("ascii"), size=(500, 500)))
    return dwg.tostring()

def add_to_zip(zip_file, image, file_name, format):
    """画像をZIPに追加する"""
    img_io = BytesIO()
    image.save(img_io, format=format)
    img_io.seek(0)
    zip_file.writestr(file_name, img_io.getvalue()) 