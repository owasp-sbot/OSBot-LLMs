from unittest import TestCase
from osbot_utils.utils.Files import file_exists, file_contents
from osbot_llms.Config import Config


class test_Config(TestCase):

    def setUp(self) -> None:
        self.config = Config()

    def test_path_code_code(self):
        path_root_code = self.config.path_root_code()
        assert path_root_code.endswith('/OSBot-LLMs/osbot_llms')

    def test_path_version_file(self):
        path_version_file = self.config.path_version_file()
        assert file_exists(path_version_file)

    def test_version(self):
        assert self.config.version() == file_contents(self.config.path_version_file()).strip()

