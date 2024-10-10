from osbot_utils.context_managers.capture_duration import capture_duration

from osbot_llms.fast_api.LLMs__Fast_API import LLMs__Fast_API

with capture_duration() as duration:
    llm_fast_api         = LLMs__Fast_API().setup()
    llm_fast_api__app    = llm_fast_api.app()
    llm_fast_api__client = llm_fast_api.client()

assert duration.seconds < 0.1

