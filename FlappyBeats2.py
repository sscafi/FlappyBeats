from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.image import Image
from kivy.uix.button import Button
from kivy.clock import Clock
from kivy.core.audio import SoundLoader
import random
import requests

# Game constants
GRAVITY = 0.5
FLAP_STRENGTH = -10
PIPE_SPEED = 2
PIPE_SPAWN_INTERVAL = 2.0  # in seconds
MIN_PIPE_GAP = 200  # Minimum gap between pipes
MAX_PIPE_GAP = 400  # Maximum gap between pipes

# EDM Radio API endpoint
EDM_RADIO_API = "https://api.edmradios.com/v1/edmradio"

class Bird:
    def __init__(self, canvas_height):
        self.x = 50
        self.y = canvas_height / 2
        self.velocity = 0
        self.width = 30
        self.height = 30

    def update(self):
        self.velocity += GRAVITY
        self.y += self.velocity

    def flap(self):
        self.velocity = FLAP_STRENGTH

class Pipe:
    def __init__(self, canvas_width, canvas_height):
        self.x = canvas_width
        self.gap = random.randint(MIN_PIPE_GAP, MAX_PIPE_GAP)
        self.top = random.randint(50, canvas_height - self.gap - 50)
        self.bottom = self.top + self.gap
        self.width = 50
        self.passed = False

    def update(self):
        self.x -= PIPE_SPEED

class FlappyBeatsGame(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.score = 0
        self.game_over = False
        self.bird = Bird(self.height)
        self.pipes = []
        self.audio = None
        self.last_pipe_spawn = 0
        self.load_music()

    def load_music(self):
        try:
            response = requests.get(EDM_RADIO_API)
            if response.status_code == 200:
                track_url = response.json()['data'][0]['track_url']
                self.audio = SoundLoader.load(track_url)
                if self.audio:
                    self.audio.play()
                    Clock.schedule_interval(self.update_game, 1.0 / 60.0)  # 60 FPS
                else:
                    print("Failed to load track from EDM Radio API")
            else:
                print(f"Failed to fetch EDM tracks. Status code: {response.status_code}")
        except Exception as e:
            print(f"Error loading music: {str(e)}")

    def update_game(self, dt):
        if not self.game_over:
            self.update_bird()
            self.update_pipes()
            self.check_collisions()
            self.spawn_pipes()

    def update_bird(self):
        self.bird.update()
        if self.bird.y + self.bird.height > self.height or self.bird.y < 0:
            self.game_over = True

    def update_pipes(self):
        for pipe in self.pipes:
            pipe.update()
            if (self.bird.x < pipe.x + pipe.width and
                    self.bird.x + self.bird.width > pipe.x and
                    (self.bird.y < pipe.top or self.bird.y + self.bird.height > pipe.bottom)):
                self.game_over = True
            if pipe.x + pipe.width < self.bird.x and not pipe.passed:
                self.score += 1
                pipe.passed = True

        self.pipes = [pipe for pipe in self.pipes if pipe.x + pipe.width > 0]

    def check_collisions(self):
        pass

    def spawn_pipes(self):
        if time() - self.last_pipe_spawn > PIPE_SPAWN_INTERVAL:
            self.pipes.append(Pipe(self.width, self.height))
            self.last_pipe_spawn = time()

    def on_touch_down(self, touch):
        self.bird.flap()

class FlappyBeatsApp(App):
    def build(self):
        return FlappyBeatsGame()


if __name__ == '__main__':
    FlappyBeatsApp().run()
