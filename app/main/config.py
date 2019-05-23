import os

# uncomment the line below for postgres database url from environment variable
# postgres_local_base = os.environ['DATABASE_URL']
mysql_db = 'mysql+pymysql://online_games:Flask#123@localhost:8181/online_games_db?charset=utf8mb4'


basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_precious_secret_key')
    ADMIN_KEY = os.getenv('ADMIN_SECRET_KEY', 'admin_precious_secret_key')
    DEBUG = False
    CORS_ENABLED = False
    CORS_HEADERS = 'Content-Type'
    SQLALCHEMY_POOL_RECYCLE = 599
    SQLALCHEMY_POOL_TIMEOUT = 20
    MYSQL_DATABASE_CHARSET = 'utf8mb4'


class DevelopmentConfig(Config):
    # uncomment the line below to use postgres
    # SQLALCHEMY_DATABASE_URI = postgres_local_base
    DEBUG = True
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'flask_boilerplate_main.db')
    SQLALCHEMY_DATABASE_URI = mysql_db
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'flask_boilerplate_test.db')
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    DEBUG = False
    # uncomment the line below to use postgres
    # SQLALCHEMY_DATABASE_URI = postgres_local_base
    SQLALCHEMY_DATABASE_URI = mysql_db


config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)

key = Config.SECRET_KEY
admin_key = Config.ADMIN_KEY