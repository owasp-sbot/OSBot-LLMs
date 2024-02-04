import os

import osbot_llms
import setuptools                   # this is needed for @patch('setuptools.setup')

from importlib.util                 import spec_from_file_location, module_from_spec
from unittest                       import TestCase
from unittest.mock                  import patch

from osbot_llms.Config import Config
from osbot_utils.utils.Files        import parent_folder


EXPECTED_PACKAGES = ['osbot_llms', 'osbot_llms.apis', 'osbot_llms.apis.open_ai']

class test_setup(TestCase):


    @patch('setuptools.setup')                                                            # this prevents the sys.exit() from being called
    def test_setup(self, mock_setup):
        parent_path     = parent_folder(osbot_llms.path)                                   # get the root of the repo
        setup_file_path = os.path.join(parent_path, 'setup.py')                           # get the setup.py file
        assert os.path.exists(setup_file_path)                                            # make sure it exists

        os.chdir(parent_path)                                                             # change current directory to root so that the README.me file can be resolved
        spec     = spec_from_file_location("some.module.name", setup_file_path)     # do this dynmamic load so that we find the correct setup file
        setup    = module_from_spec(spec)
        spec.loader.exec_module(setup)

        args, kwargs = mock_setup.call_args                                                # capture the params used on the setup call
        assert kwargs.get('name'            ) == 'osbot_llms'
        assert kwargs.get('description'     ) == 'OWASP Security Bot - LLMs'
        assert kwargs.get('long_description') == setup.long_description
        assert kwargs.get('version'         ) == Config().version()
        assert sorted(kwargs.get('packages' )) == sorted(EXPECTED_PACKAGES)