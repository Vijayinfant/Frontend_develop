import json
import redis
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Prompt

redis_client = redis.Redis(
    host=os.environ.get('REDIS_HOST', 'localhost'),
    port=int(os.environ.get('REDIS_PORT', 6379)),
    db=0,
    decode_responses=True
)

@csrf_exempt
def prompt_list_create(request):
    if request.method == 'GET':
        prompts = Prompt.objects.all().order_by('-created_at')
        return JsonResponse([p.to_dict() for p in prompts], safe=False)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            prompt = Prompt.objects.create(
                title=data['title'],
                content=data['content'],
                complexity=data['complexity']
            )
            # Initialize view count
            redis_client.set(f"prompt_view_count:{prompt.id}", 0)
            return JsonResponse(prompt.to_dict(), status=201)
        except (KeyError, ValueError, json.JSONDecodeError) as e:
            return JsonResponse({'error': 'Invalid data'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

def prompt_detail(request, prompt_id):
    if request.method == 'GET':
        prompt = get_object_or_404(Prompt, id=prompt_id)
        
        # Increment view count
        redis_key = f"prompt_view_count:{prompt.id}"
        view_count = redis_client.incr(redis_key)
        
        data = prompt.to_dict()
        data['view_count'] = view_count
        return JsonResponse(data)
        
    return JsonResponse({'error': 'Method not allowed'}, status=405)
