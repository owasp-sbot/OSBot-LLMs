from unittest import TestCase

from osbot_prefect.flows.Flow_Events__To__Prefect_Server import Flow_Events__To__Prefect_Server
from osbot_utils.helpers.flows.Flow import Flow
from osbot_utils.helpers.flows.decorators.flow import flow
from osbot_utils.helpers.flows.decorators.task import task
from osbot_utils.helpers.flows.models.Flow__Config import Flow__Config
from osbot_utils.utils.Dev import pprint


class test__prefect_support(TestCase):

    def test__flow__(self):



        @flow(flow_config=Flow__Config(log_to_console=True))
        def an_flow() -> Flow:
            print('inside the flow')
            an_task()
            return 'abc'

        @task()
        def an_task():
            print('inside the task')

        print()
        with Flow_Events__To__Prefect_Server() :
            with an_flow() as _:
                _.execute_flow()
                pprint(_.flow_return_value)