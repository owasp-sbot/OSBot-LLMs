from osbot_utils.base_classes.Kwargs_To_Self    import Kwargs_To_Self
from osbot_utils.helpers.Random_Guid            import Random_Guid


class LLM__Task(Kwargs_To_Self):
    task_id     : Random_Guid
    workflow_id : Random_Guid