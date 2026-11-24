import io
import zipfile
import unittest
import pptx_to_json as pptx
import validate_site

class SiteTests(unittest.TestCase):
    def test_system_color_uses_hex_fallback(self):
        data = io.BytesIO()
        with zipfile.ZipFile(data, 'w') as z:
            z.writestr('ppt/theme/theme1.xml', '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:themeElements><a:clrScheme name="test"><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1></a:clrScheme></a:themeElements></a:theme>')
        with zipfile.ZipFile(data) as z:
            self.assertEqual(pptx.theme_palette(z, {'rId1': 'ppt/theme/theme1.xml'}), {'lt1': 'FFFFFF', 'dk1': '000000'})

    def test_publication_links_and_media(self):
        self.assertEqual(validate_site.validate()['errors'], [])
