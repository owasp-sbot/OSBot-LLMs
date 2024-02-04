from osbot_utils.utils.Files import file_contents, path_combine

import osbot_llms


class Config:

    FILE_NAME_VERSION = 'version'

    def path_root_code(self):
        return osbot_llms.__path__[0]

    def path_version_file(self):
        return path_combine(self.path_root_code(), self.FILE_NAME_VERSION)

    def version(self):
        return file_contents(self.path_version_file()).strip()