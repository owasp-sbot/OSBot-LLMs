from osbot_utils.context_managers.capture_duration import capture_duration

from osbot_llms.fast_api.Fast_API__LLMs import Fast_API__LLMs

with capture_duration() as duration:
    llm_fast_api         = Fast_API__LLMs().setup()
    llm_fast_api__app    = llm_fast_api.app()
    llm_fast_api__client = llm_fast_api.client()

assert duration.seconds < 0.1

