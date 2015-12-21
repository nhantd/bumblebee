cat run.pid | xargs kill -9
cp main.log main.log.backup
echo "============ NEW RUN =============="  > main.log
node . $1 >> main.log 2>&1 &
echo $! > run.pid

