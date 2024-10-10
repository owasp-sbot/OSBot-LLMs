from unittest import TestCase

from osbot_llms.utils.Version import Version, version__osbot_llms
from osbot_utils.utils.Files  import file_exists, file_contents


class test_Version(TestCase):

    def setUp(self):
        self.version = Version()

    def test_value(self):
        assert self.version.value() == file_contents(self.version.path_version_file()).strip()

    def test_path_version_file(self):
        assert file_exists(self.version.path_version_file()) is True

    def test_version__osbot_llms(self):
        assert self.version.value() == version__osbot_llms