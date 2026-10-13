-- Section 2 of the Software developers course
-- (content/sample-course-event-driven.md).
insert into public.sections (id, course_id, position, title) values
  ('developers-event-driven', 'software-developers', 2, 'Event-driven systems');

insert into public.lessons (id, section_id, position, title) values
  ('build-an-order-pipeline', 'developers-event-driven', 1, 'Build an order pipeline');

-- The palette is listed in a mixed order so it doesn't give the answer away.
insert into public.exercises (lesson_id, position, type, content, solution, explanation) values
  ('build-an-order-pipeline', 1, 'system_builder',
   '{
     "question": "Build the order pipeline: add the services you need and connect them.",
     "scenario": "Your online shop must accept orders even when traffic spikes on sale days. The order API should answer customers right away and leave the slow work, saving the order and emailing a confirmation, to a background worker. No order may be lost if the worker is busy or briefly down.",
     "nodes": [
       {"id": "sentinel", "label": "Microsoft Sentinel", "role": "Security monitoring"},
       {"id": "service-bus", "label": "Azure Service Bus", "role": "Order queue"},
       {"id": "static-web-apps", "label": "Azure Static Web Apps", "role": "Shop frontend"},
       {"id": "iot-hub", "label": "Azure IoT Hub", "role": "Device messaging"},
       {"id": "cosmos-db", "label": "Azure Cosmos DB", "role": "Orders database"},
       {"id": "functions", "label": "Azure Functions", "role": "Order processor"},
       {"id": "virtual-desktop", "label": "Azure Virtual Desktop", "role": "Remote desktops"},
       {"id": "communication-services", "label": "Azure Communication Services", "role": "Confirmation email"},
       {"id": "container-apps", "label": "Azure Container Apps", "role": "Order API"}
     ]
   }',
   '{
     "nodes": ["static-web-apps", "container-apps", "service-bus", "functions", "cosmos-db", "communication-services"],
     "connections": [
       {"from": "static-web-apps", "to": "container-apps"},
       {"from": "container-apps", "to": "service-bus"},
       {"from": "service-bus", "to": "functions"},
       {"from": "functions", "to": "cosmos-db"},
       {"from": "functions", "to": "communication-services"}
     ]
   }',
   'The shop frontend on Static Web Apps sends each order to the API on Container Apps. The API puts the order on a Service Bus queue and answers the customer right away. Azure Functions takes orders from the queue at its own pace, saves them in Cosmos DB and sends the confirmation email with Communication Services. If the worker is busy or down, orders wait safely in the queue.');
