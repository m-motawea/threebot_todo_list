from Jumpscale import j
import datetime

class todo_list(j.baseclasses.threebot_actor):
    def _init(self, *args, **kwargs):
        self.bcdb = self.package.bcdb
        self.model = self.bcdb.model_get(url="threebot.todo_list.item.1")

    @j.baseclasses.actor_method
    def add_item(self, title, description, deadline, done=False, schema_out=None, user_session=None):
        """
        ```in
        title = (S)
        description = (S)
        deadline = (T)
        ```
        """
        item = self.model.new()
        item.title = title
        item.description = description
        item.done = done
        item.deadline = deadline
        a = datetime.datetime.now()
        item.time_created = "%s/%s/%s %s:%s" % (a.day, a.month, a.year, a.hour, a.minute)
        item = self.model.set(item)
        item_dict = {
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "deadline": item.deadline,
            "done": item.done,
            "last_updated": item.last_updated,
            "time_created": item.time_created
        }
        return j.data.serializers.json.dumps(item_dict)

    @j.baseclasses.actor_method
    def edit_item(self, item_id, title=None, description=None, deadline=None, done=None, schema_out=None, user_session=None):
        item_id = int(item_id)
        item = self.model.get(item_id)
        if title:
            item.title = title
        if description:
            item.description = description
        if deadline:
            item.deadline = deadline
        if done != None:
            item.done = done
        a = datetime.datetime.now()
        item.last_updated = "%s/%s/%s %s:%s" % (a.day, a.month, a.year, a.hour, a.minute)
        item.save()
        item_dict = {
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "deadline": item.deadline,
            "done": item.done,
            "last_updated": item.last_updated,
            "time_created": item.time_created
        }
        return j.data.serializers.json.dumps(item_dict)

    @j.baseclasses.actor_method
    def delete_item(self, item_id, schema_out=None, user_session=None):
        item_id = int(item_id)
        item = self.model.get(item_id)
        item.delete()

    @j.baseclasses.actor_method
    def get_item(self, item_id, schema_out=None, user_session=None):
        item_id = int(item_id)
        item = self.model.get(item_id)
        item_dict = {
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "deadline": item.deadline,
            "done": item.done,
            "last_updated": item.last_updated,
            "time_created": item.time_created
        }
        return j.data.serializers.json.dumps(item_dict)

    @j.baseclasses.actor_method
    def list_items(self, schema_out=None, user_session=None):
        items_iter = self.model.iterate()
        items = []
        for item in items_iter:
            items.append({
            "id": item.id,
            "title": item.title,
            "deadline": item.deadline,
            "done": item.done
        })
        return j.data.serializers.json.dumps(items)
